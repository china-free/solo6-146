import { useState, useMemo, useRef } from 'react';
import { useMaterialStore } from '@/store/materialStore';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Trash2, Wand2 } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

export default function MaterialGrid() {
  const {
    materials,
    categories,
    selectedCategory,
    uploadMaterial,
    deleteMaterial,
    useMaterial,
  } = useMaterialStore();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredMaterials = useMemo(() => {
    let result = materials;
    if (selectedCategory !== 'all') {
      result = result.filter((m) => m.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }
    return result;
  }, [materials, selectedCategory, searchQuery]);

  const handleOpenUpload = () => {
    setUploadCategory(selectedCategory !== 'all' ? selectedCategory : (categories[0]?.id || ''));
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadCategory) return;
    setIsUploading(true);
    try {
      await uploadMaterial(selectedFile, uploadCategory);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleUseMaterial = (id: string) => {
    useMaterial(id);
    navigate('/');
  };

  const handleDeleteMaterial = (id: string, name: string) => {
    if (confirm(`确定删除素材 "${name}" 吗？`)) {
      deleteMaterial(id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索素材名称..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-border-neon rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300"
          />
        </div>

        <Button
          variant="primary"
          onClick={handleOpenUpload}
          className="flex items-center gap-2"
        >
          <Upload size={18} />
          上传素材
        </Button>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-border-neon flex items-center justify-center mb-6">
            <Upload size={40} className="text-gray-500" />
          </div>
          <h3 className="font-display text-xl text-gray-400 mb-2">
            暂无素材
          </h3>
          <p className="text-gray-500 mb-6">上传你的第一张图片吧</p>
          <Button variant="primary" onClick={handleOpenUpload}>
            立即上传
          </Button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-card cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-card-glow"
              >
                <img
                  src={material.url}
                  alt={material.name}
                  className="w-full h-full object-cover"
                />

                <div
                  className={cn(
                    'absolute top-2 left-2 px-2 py-1 text-xs rounded-full font-medium',
                    material.isSystem
                      ? 'bg-neon-blue/80 text-bg-deep'
                      : 'bg-neon-yellow/80 text-bg-deep'
                  )}
                >
                  {material.isSystem ? '系统' : '用户'}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate mb-3">
                    {material.name}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 !py-1.5 text-xs flex items-center justify-center gap-1"
                      onClick={() => handleUseMaterial(material.id)}
                    >
                      <Wand2 size={14} />
                      使用
                    </Button>
                    {!material.isSystem && (
                      <button
                        onClick={() =>
                          handleDeleteMaterial(material.id, material.name)
                        }
                        className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-all duration-200"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="上传素材"
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              选择分类
            </label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-4 py-3 bg-bg-card border border-border-neon rounded-xl text-white focus:outline-none focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="" disabled>
                请选择分类
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              选择图片
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
                selectedFile
                  ? 'border-neon-pink bg-neon-pink/10'
                  : 'border-border-neon hover:border-neon-pink hover:bg-neon-pink/5'
              )}
            >
              {selectedFile ? (
                <div>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-bg-card">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-neon-pink text-xs mt-2">点击重新选择</p>
                </div>
              ) : (
                <div>
                  <Upload size={40} className="mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400 mb-1">点击选择图片</p>
                  <p className="text-gray-600 text-xs">
                    支持 JPG / PNG / GIF / WebP
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsUploadModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleUpload}
              disabled={!selectedFile || !uploadCategory || isUploading}
            >
              {isUploading ? '上传中...' : '上传'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
