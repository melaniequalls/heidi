import { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { supabase, Condition } from '../lib/supabase';

export default function Conditions() {
  const [conditions, setConditions] = useState<Condition[]>([]);

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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-stone-900">Conditions</h2>
            {conditions.length > 0 && (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <button
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Condition</span>
          </button>
        </div>

        <div className="space-y-2 mt-3">
          {conditions.map((condition) => (
            <div
              key={condition.id}
              className="bg-stone-50 rounded-lg border border-stone-200 p-3"
            >
              <p className="font-medium text-stone-900">{condition.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
