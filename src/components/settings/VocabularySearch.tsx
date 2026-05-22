/**
 * 字词句练习搜索组件
 */

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

interface VocabItem {
  id: string;
  title: string;
  grade: string;
  content: string;
}

interface VocabCategory {
  id: string;
  name: string;
  items: VocabItem[];
}

interface VocabularySearchProps {
  onSelect: (content: string) => void;
}

export function VocabularySearch({ onSelect }: VocabularySearchProps) {
  const [categories, setCategories] = useState<VocabCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    setIsLoading(true);
    fetch('/vocabulary/primary-school.json')
      .then(res => {
        if (!res.ok) throw new Error('加载失败');
        return res.json();
      })
      .then(data => {
        setCategories(data.categories || []);
        setError(null);
      })
      .catch(() => {
        setError('字词句库加载失败');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 合并所有条目
  const allItems = useMemo(() => {
    return categories.flatMap(cat =>
      cat.items.map(item => ({ ...item, category: cat.name }))
    );
  }, [categories]);

  // 搜索引擎
  const fuse = useMemo(() => {
    if (allItems.length === 0) return null;
    return new Fuse(allItems, {
      keys: ['title', 'grade', 'content'],
      threshold: 0.3,
    });
  }, [allItems]);

  // 过滤结果
  const filteredItems = useMemo(() => {
    let items = allItems;

    // 分类筛选
    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.id === selectedCategory);
      items = cat ? cat.items.map(item => ({ ...item, category: cat.name })) : [];
    }

    // 关键词搜索
    if (searchQuery.trim() && fuse) {
      return fuse.search(searchQuery).map(r => r.item).filter(item =>
        selectedCategory === 'all' || categories.find(c => c.id === selectedCategory)?.items.some(i => i.id === item.id)
      );
    }

    return items;
  }, [searchQuery, selectedCategory, allItems, categories, fuse]);

  const handleSelect = (item: VocabItem) => {
    onSelect(item.content);
    setSearchQuery('');
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          字词句练习
          <span className="text-xs text-gray-400 ml-2">(32组)</span>
        </label>

        {/* 分类选择 */}
        <div className="flex gap-2 mb-2">
          {[
            { id: 'all', name: '全部' },
            { id: 'shengzi', name: '生字' },
            { id: 'ciyu', name: '词语' },
            { id: 'jvzi', name: '句子' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索年级、标题或内容..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-sm"
        />
      </div>

      {isLoading && (
        <div className="text-sm text-gray-400 text-center py-4">加载中...</div>
      )}

      {error && (
        <div className="text-sm text-red-500 text-center py-4">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="max-h-48 overflow-y-auto space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-4">未找到结果</div>
          ) : (
            filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-2.5 border border-gray-200 rounded-lg
                           hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.grade} · {item.category}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {item.content.substring(0, 30)}...
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
