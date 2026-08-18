import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="font-semibold text-slate-800 mb-2">Total Loans</h3>
                        <p className="text-3xl font-bold text-emerald-500">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
