/**
 * 古诗词搜索组件
 * 支持关键词搜索,一键填入
 * 数据源: chinese-poetry GitHub 仓库
 */

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

interface Poetry {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  content: string;
}

interface PoetrySearchProps {
  onSelect: (content: string) => void;
}

export function PoetrySearch({ onSelect }: PoetrySearchProps) {
  const [poetryData, setPoetryData] = useState<Poetry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载古诗数据(本地课本常见古诗)
  useEffect(() => {
    setIsLoading(true);
    fetch('/poetry.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败');
        return res.json();
      })
      .then(data => {
        setPoetryData(data);
        setError(null);
      })
      .catch(() => {
        setError('古诗库加载失败');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Fuse.js 配置
  const fuse = useMemo(() => {
    if (poetryData.length === 0) return null;
    return new Fuse(poetryData, {
      keys: ['title', 'author', 'content'],
      threshold: 0.4,
      includeScore: true,
    });
  }, [poetryData]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !fuse) return poetryData;
    return fuse.search(searchQuery).map(r => r.item);
  }, [searchQuery, fuse, poetryData]);

  const handleSelect = (poetry: Poetry) => {
    // 格式化: 标题居中 + 作者 + 空行 + 诗句
    const formatted = `${poetry.title}\n${poetry.dynasty}·${poetry.author}\n\n${poetry.content}`;
    onSelect(formatted);
    setSearchQuery('');
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          古诗词库
          <span className="text-xs text-gray-400 ml-2">(课本常见)</span>
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索标题、作者或内容..."
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
        <div className="max-h-60 overflow-y-auto space-y-2">
          {searchResults.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-4">未找到结果</div>
          ) : (
            searchResults.map(poetry => (
              <button
                key={poetry.id}
                onClick={() => handleSelect(poetry)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg
                           hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm">
                      《{poetry.title}》
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {poetry.dynasty}·{poetry.author}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {poetry.content.split('\n')[0]}
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
