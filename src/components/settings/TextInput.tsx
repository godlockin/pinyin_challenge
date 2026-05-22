/**
 * 文字输入组件
 * 支持直接输入、粘贴、文件上传（txt/pdf/docx）
 */

import { useRef, useState, type ChangeEvent } from 'react';
import { parseFile, validateFileSize, getSupportedFileTypes, getSupportedMimeTypes } from '../../services/fileParserService';
import type { PinyinPair } from '../../types/settings';

interface TextInputProps {
  /** 输入文本值 */
  value: string;
  /** 值变化回调 */
  onChange: (value: string, pinyinPairs?: PinyinPair[]) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 最大字符数 */
  maxLength?: number;
}

export function TextInput({
  value,
  onChange,
  placeholder = '请输入或粘贴汉字内容...',
  maxLength = 10000,
}: TextInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadInfo, setUploadInfo] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue, undefined); // 手动输入清除拼音配对
      setUploadError(null);
      setUploadInfo(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const currentLength = value.length;
    const availableSpace = maxLength - currentLength;
    const textToInsert = pastedText.slice(0, availableSpace);

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.slice(0, start) + textToInsert + value.slice(end);
    if (newValue.length <= maxLength) {
      onChange(newValue, undefined);
      setUploadError(null);
      setUploadInfo(null);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    if (!validateFileSize(file, 10)) {
      setUploadError('文件大小超过 10MB 限制');
      return;
    }

    setIsLoading(true);
    setUploadError(null);
    setUploadInfo(null);

    try {
      const result = await parseFile(file);

      if (result.success) {
        const textToAdd = result.text.slice(0, maxLength);

        // 转换拼音配对格式
        const pinyinPairs = result.pinyinPairs?.map(p => ({
          hanzi: p.hanzi,
          pinyin: p.pinyin,
        }));

        onChange(textToAdd, pinyinPairs);

        // 显示提示信息
        const messages: string[] = [];
        if (result.text.length > maxLength) {
          messages.push(`内容已截断至 ${maxLength} 字符`);
        }
        if (pinyinPairs && pinyinPairs.length > 0) {
          messages.push(`已识别 ${pinyinPairs.length} 个拼音标注`);
        }
        if (messages.length > 0) {
          setUploadInfo(messages.join('；'));
        }
      } else {
        setUploadError(result.error || '文件解析失败');
      }
    } catch {
      setUploadError('文件读取失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    onChange('', undefined);
    setUploadError(null);
    setUploadInfo(null);
  };

  // 统计汉字数量
  const hanziCount = (value.match(/[一-龥]/g) || []).length;
  const totalCount = value.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          输入文字
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isLoading}
            className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600
                       hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
          >
            {isLoading ? (
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            上传文件
          </button>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              清空
            </button>
          )}
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getSupportedMimeTypes()}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 文件格式提示 */}
      <p className="text-xs text-gray-400">
        支持格式: {getSupportedFileTypes()}
      </p>

      <textarea
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-gray-800 placeholder-gray-400 disabled:bg-gray-100
                   min-h-[150px]"
      />

      {/* 错误提示 */}
      {uploadError && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {uploadError}
        </p>
      )}

      {/* 上传成功提示 */}
      {uploadInfo && !uploadError && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {uploadInfo}
        </p>
      )}

      <div className="flex justify-between text-xs text-gray-500">
        <span>汉字: {hanziCount} 个</span>
        <span className={totalCount >= maxLength ? 'text-red-500' : ''}>
          {totalCount} / {maxLength}
        </span>
      </div>
    </div>
  );
}
