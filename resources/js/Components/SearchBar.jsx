import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchBar({ initialQuery = '', onSearch }) {
    const [query, setQuery] = useState(initialQuery);
    const { post } = useForm();
    
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    const clearSearch = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center bg-card rounded-full shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                <div className="absolute start-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for services, freelancers, or skills..."
                    className="bg-transparent text-lg placeholder-muted-foreground p-0 w-full h-full min-h-[50px] px-12 focus:outline-none focus:ring-0 focus:border-0 border-0 shadow-none"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute end-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </form>
    );
}