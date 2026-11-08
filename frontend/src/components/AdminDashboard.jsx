
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const STATUSES = ['pending', 'approved', 'rejected', 'changes_requested'];

const statusLabels = {
    pending: 'Pending review',
    approved: 'Approved',
    rejected: 'Rejected',
    changes_requested: 'Changes requested'
};

export default function AdminDashboard({ onExit }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const [selected, setSelected] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');

    const isAdmin = user?.app_metadata?.role === 'admin';

    // Restore the existing Supabase session and listen for auth changes.
    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (!active) return;

            if (error) {
                setLoginError(error.message);
            }

            setUser(data?.session?.user ?? null);
            setAuthLoading(false);
        };

        restoreSession();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
            setLoginError('');
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    // Load contributions only when the signed-in user has the admin role.
    const loadContributions = async () => {
        setLoading(true);
        setLoadError('');

        const { data, error } = await supabase
            .from('contributions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setLoadError(error.message);
            setContributions([]);
        } else {
            setContributions(data ?? []);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (isAdmin) {
            loadContributions();
        } else {
            setContributions([]);
        }
    }, [isAdmin]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError('');

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password
        });

        if (error) {
            setLoginError(error.message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setContributions([]);
        setSelected(null);
    };

    const openReview = (contribution) => {
        setSelected(contribution);
        setReviewNote(contribution.review_note ?? '');
        setActionError('');
    };

    const handleReviewAction = async (newStatus) => {
        if (!selected || !user) return;

        if (
            (newStatus === 'rejected' ||
                newStatus === 'changes_requested') &&
            !reviewNote.trim()
        ) {
            setActionError('Please enter a review note for this decision.');
            return;
        }

        setActionLoading(true);
        setActionError('');

        const { error } = await supabase
            .from('contributions')
            .update({
                status: newStatus,
                review_note: reviewNote.trim() || null,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id
            })
            .eq('id', selected.id);

        if (error) {
            setActionError(error.message);
        } else {
            setSelected(null);
            await loadContributions();
        }

        setActionLoading(false);
    };

    const counts = {
        all: contributions.length,
        pending: contributions.filter((item) => item.status === 'pending').length,
        approved: contributions.filter((item) => item.status === 'approved').length,
        rejected: contributions.filter((item) => item.status === 'rejected').length,
        changes_requested: contributions.filter(
            (item) => item.status === 'changes_requested'
        ).length
    };

    const filteredContributions = contributions.filter((item) => {
        const matchesStatus = filter === 'all' || item.status === filter;
        const query = search.trim().toLowerCase();

        const matchesSearch =
            !query ||
            item.title?.toLowerCase().includes(query) ||
            item.locality?.toLowerCase().includes(query) ||
            item.reference_id?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });

    const formatDate = (value) => {
        if (!value) return 'Not available';

        return new Date(value).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
                <p className="text-[#5A1827]">Checking admin session...</p>
            </div>
        );
    }

    // Login screen
    if (!user) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5 py-20">
                <div className="w-full max-w-md bg-white border border-[#B8973D]/30 rounded-3xl shadow-xl p-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#B8973D] font-bold mb-3">
                        RIVA Administration
                    </p>

                    <h1 className="text-3xl font-serif text-[#5A1827] mb-2">
                        Admin Login
                    </h1>

                    <p className="text-sm text-gray-500 mb-8">
                        Sign in using your existing RIVA administrator account.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#5A1827]"
                                placeholder="Admin email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#5A1827]"
                                placeholder="Your password"
                            />
                        </div>

                        {loginError && (
                            <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
                                {loginError}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#5A1827] hover:bg-[#7A2236] text-white rounded-full py-3 font-semibold"
                        >
                            Sign In
                        </button>
                    </form>

                    <button
                        onClick={onExit}
                        className="w-full mt-5 text-sm text-gray-500 hover:text-[#5A1827]"
                    >
                        Return to RIVA
                    </button>
                </div>
            </div>
        );
    }

    // Signed-in account without the admin role
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5">
                <div className="max-w-md bg-white rounded-2xl border p-8 text-center">
                    <h1 className="text-2xl font-serif text-[#5A1827] mb-3">
                        Access denied
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        This account does not have the RIVA administrator role.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="bg-[#5A1827] text-white rounded-full px-6 py-3"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#221E1F] px-5 py-10 md:px-10">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#B8973D] font-bold mb-2">
                            RIVA · Administration
                        </p>
                        <h1 className="text-3xl md:text-4xl font-serif text-[#5A1827]">
                            Preservation Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Review and manage community contributions.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onExit}
                            className="border border-[#5A1827]/30 text-[#5A1827] rounded-full px-5 py-2 text-sm"
                        >
                            View RIVA
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-[#5A1827] text-white rounded-full px-5 py-2 text-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {[
                        ['All submissions', counts.all],
                        ['Pending', counts.pending],
                        ['Approved', counts.approved],
                        ['Rejected', counts.rejected],
                        ['Changes requested', counts.changes_requested]
                    ].map(([label, count]) => (
                        <div
                            key={label}
                            className="bg-white border border-[#B8973D]/20 rounded-2xl p-5"
                        >
                            <p className="text-xs text-gray-500 mb-2">{label}</p>
                            <p className="text-3xl font-serif text-[#5A1827]">{count}</p>
                        </div>
                    ))}
                </section>

                <section className="bg-white rounded-2xl border border-[#B8973D]/25 p-5 md:p-7">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-serif text-[#5A1827]">
                                Community Contributions
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Select a submission to review it.
                            </p>
                        </div>

                        <button
                            onClick={loadContributions}
                            disabled={loading}
                            className="border border-[#5A1827]/30 rounded-full px-5 py-2 text-sm text-[#5A1827] disabled:opacity-50"
                        >
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mb-6">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search title, locality or reference..."
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5A1827]"
                        />

                        <select
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
                        >
                            <option value="all">All statuses</option>
                            {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {statusLabels[status]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loadError && (
                        <p className="bg-red-50 text-red-700 rounded-xl p-4 text-sm mb-5">
                            Could not load contributions: {loadError}
                        </p>
                    )}

                    {loading ? (
                        <p className="text-center text-gray-500 py-12">
                            Loading contributions...
                        </p>
                    ) : filteredContributions.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">
                            No contributions found.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {filteredContributions.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => openReview(item)}
                                    className="w-full text-left border border-gray-100 hover:border-[#B8973D]/60 rounded-xl p-4 transition-colors"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-[#5A1827]">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.category} · {item.locality}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {item.reference_id} · {formatDate(item.created_at)}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {item.is_culturally_sensitive && (
                                                <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full">
                                                    Sensitive
                                                </span>
                                            )}
                                            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                                {statusLabels[item.status] ?? item.status}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-start justify-center">
                    <div className="bg-white rounded-2xl w-full max-w-2xl my-8 p-6 md:p-8">
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#B8973D] font-bold">
                                    Contribution review
                                </p>
                                <h2 className="text-2xl font-serif text-[#5A1827] mt-2">
                                    {selected.title}
                                </h2>
                                <p className="text-xs text-gray-500 mt-2">
                                    {selected.reference_id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-500 hover:text-black text-2xl"
                                aria-label="Close review"
                            >
                                ×
                            </button>
                        </div>

                        {selected.is_culturally_sensitive && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm mb-5">
                                This contribution was marked as culturally sensitive.
                                Review carefully before making it public.
                            </div>
                        )}

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Category and locality</p>
                                <p>{selected.category} · {selected.locality}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs mb-1">Description</p>
                                <p className="whitespace-pre-wrap">{selected.description}</p>
                            </div>

                            {selected.context && (
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Historical context</p>
                                    <p className="whitespace-pre-wrap">{selected.context}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-gray-500 text-xs mb-1">Contributor</p>
                                <p>
                                    {selected.credit_preference === 'anonymous'
                                        ? 'Anonymous Contributor'
                                        : selected.contributor_name || 'Community Member'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs mb-1">Submitted</p>
                                <p>{formatDate(selected.created_at)}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs mb-1">Current status</p>
                                <p>{statusLabels[selected.status] ?? selected.status}</p>
                            </div>

                            {selected.review_note && (
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Previous review note</p>
                                    <p className="whitespace-pre-wrap">{selected.review_note}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold mb-2">
                                    Admin review note
                                </label>
                                <textarea
                                    value={reviewNote}
                                    onChange={(event) => setReviewNote(event.target.value)}
                                    rows={4}
                                    placeholder="Explain your decision or requested corrections..."
                                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#5A1827]"
                                />
                            </div>

                            {actionError && (
                                <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
                                    {actionError}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleReviewAction('approved')}
                                    className="bg-green-700 text-white rounded-full px-5 py-3 text-sm disabled:opacity-50"
                                >
                                    Approve
                                </button>

                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleReviewAction('changes_requested')}
                                    className="bg-amber-600 text-white rounded-full px-5 py-3 text-sm disabled:opacity-50"
                                >
                                    Request changes
                                </button>

                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleReviewAction('rejected')}
                                    className="bg-red-700 text-white rounded-full px-5 py-3 text-sm disabled:opacity-50"
                                >
                                    Reject
                                </button>

                                <button
                                    disabled={actionLoading}
                                    onClick={() => setSelected(null)}
                                    className="border border-gray-200 rounded-full px-5 py-3 text-sm"
                                >
                                    Close
                                </button>
                            </div>

                            {actionLoading && (
                                <p className="text-xs text-gray-500">Saving review decision...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
