import { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { supabase, Condition } from '../lib/supabase';

export default function Conditions() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchConditions();

    const channel = supabase
      .channel('conditions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conditions' },
        () => {
          fetchConditions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConditions = async () => {
    const { data, error } = await supabase
      .from('conditions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conditions:', error);
    } else {
      setConditions(data || []);
    }
  };

  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 w-full mb-3 hover:opacity-70 transition-opacity"
        >
          <ChevronDown
            className={`w-5 h-5 text-stone-600 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
          />
          <h2 className="text-lg font-semibold text-stone-900">Conditions</h2>
        </button>

        {isExpanded && <div className="space-y-2 mb-3">
          {conditions.map((condition) => (
            <div
              key={condition.id}
              className="bg-stone-50 rounded-lg border border-stone-200 p-3"
            >
              <p className="font-medium text-stone-900">{condition.name}</p>
            </div>
          ))}
        </div>}

        {isExpanded && (
          <button
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New condition</span>
          </button>
        )}
      </div>
    </div>
  );
}
