import React, { useState, useEffect } from 'react';
import { MenuCategory, MenuItem } from '../types';
import { getMenuCategories, saveMenuCategories } from '../services/menuService';

interface MenuManagerProps {
  onMenuUpdated: (categories: MenuCategory[]) => void;
}

const emptyItem = () => ({ name: '', price: '', imageUrl: '' });

const MenuManager: React.FC<MenuManagerProps> = ({ onMenuUpdated }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  const [editingItem, setEditingItem] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  const [editValues, setEditValues] = useState(emptyItem());

  const [addingToCat, setAddingToCat] = useState<number | null>(null);
  const [newItem, setNewItem] = useState(emptyItem());

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    getMenuCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const applyChange = (updated: MenuCategory[]) => {
    setCategories(updated);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveMenuCategories(categories);
    setSaving(false);
    if (ok) {
      setHasChanges(false);
      onMenuUpdated(categories);
      setSaveMessage('Saved successfully!');
    } else {
      setSaveMessage('Save failed — please try again.');
    }
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const startEdit = (catIdx: number, itemIdx: number) => {
    const item = categories[catIdx].items[itemIdx];
    setEditingItem({ catIdx, itemIdx });
    setEditValues({ name: item.name, price: item.price, imageUrl: item.imageUrl });
    setAddingToCat(null);
  };

  const confirmEdit = () => {
    if (!editingItem || !editValues.name.trim() || !editValues.price.trim()) return;
    const updated = categories.map((cat, ci) =>
      ci !== editingItem.catIdx ? cat : {
        ...cat,
        items: cat.items.map((item, ii) =>
          ii !== editingItem.itemIdx ? item : { ...item, ...editValues }
        ),
      }
    );
    applyChange(updated);
    setEditingItem(null);
  };

  const deleteItem = (catIdx: number, itemIdx: number) => {
    applyChange(
      categories.map((cat, ci) =>
        ci !== catIdx ? cat : { ...cat, items: cat.items.filter((_, ii) => ii !== itemIdx) }
      )
    );
  };

  const confirmAddItem = (catIdx: number) => {
    if (!newItem.name.trim() || !newItem.price.trim()) return;
    const imageUrl = newItem.imageUrl.trim() || `https://picsum.photos/seed/${Date.now()}/400/300`;
    applyChange(
      categories.map((cat, ci) =>
        ci !== catIdx ? cat : { ...cat, items: [...cat.items, { ...newItem, imageUrl }] }
      )
    );
    setAddingToCat(null);
    setNewItem(emptyItem());
  };

  const deleteCategory = (catIdx: number) => {
    if (!window.confirm(`Delete "${categories[catIdx].title}" and all its items?`)) return;
    applyChange(categories.filter((_, ci) => ci !== catIdx));
    if (expandedCat === catIdx) setExpandedCat(null);
  };

  const confirmAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const next = [...categories, { title: newCategoryName.trim(), items: [] }];
    applyChange(next);
    setExpandedCat(next.length - 1);
    setNewCategoryName('');
    setAddingCategory(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Menu Editor</h2>
          <p className="text-sm text-gray-500 mt-0.5">Changes only go live after you click Save</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm font-semibold ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="bg-pink-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-5 text-sm text-amber-800">
          You have unsaved changes — click <strong>Save Changes</strong> to publish them to the website.
        </div>
      )}

      {/* Category list */}
      <div className="space-y-3">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Category header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => setExpandedCat(expandedCat === catIdx ? null : catIdx)}
            >
              <div className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${expandedCat === catIdx ? 'rotate-90' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-gray-800">{category.title}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteCategory(catIdx); }}
                className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Delete category
              </button>
            </div>

            {/* Items */}
            {expandedCat === catIdx && (
              <div className="border-t border-gray-100">
                {category.items.length === 0 && (
                  <p className="text-sm text-gray-400 px-5 py-3">No items yet — add one below.</p>
                )}

                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-b border-gray-100 last:border-b-0 px-4 py-3">
                    {editingItem?.catIdx === catIdx && editingItem?.itemIdx === itemIdx ? (
                      /* Edit form */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Item Name</label>
                            <input
                              type="text"
                              value={editValues.name}
                              onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                            <input
                              type="text"
                              value={editValues.price}
                              onChange={(e) => setEditValues((v) => ({ ...v, price: e.target.value }))}
                              placeholder="e.g. R350"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={editValues.imageUrl}
                            onChange={(e) => setEditValues((v) => ({ ...v, imageUrl: e.target.value }))}
                            placeholder="https://... or /image-filename.jpeg"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={confirmEdit} className="bg-pink-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-pink-700">
                            Save
                          </button>
                          <button onClick={() => setEditingItem(null)} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Read row */
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/48/48'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                          <p className="text-pink-600 font-semibold text-sm">{item.price}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => startEdit(catIdx, itemIdx)}
                            className="text-blue-600 hover:text-blue-800 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(catIdx, itemIdx)}
                            className="text-red-400 hover:text-red-600 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add item row */}
                {addingToCat === catIdx ? (
                  <div className="px-4 py-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700 mb-3">New Item</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Item Name *</label>
                          <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem((v) => ({ ...v, name: e.target.value }))}
                            placeholder="e.g. Chocolate Cake"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Price *</label>
                          <input
                            type="text"
                            value={newItem.price}
                            onChange={(e) => setNewItem((v) => ({ ...v, price: e.target.value }))}
                            placeholder="e.g. R350"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Image URL (optional — leave blank for placeholder)</label>
                        <input
                          type="text"
                          value={newItem.imageUrl}
                          onChange={(e) => setNewItem((v) => ({ ...v, imageUrl: e.target.value }))}
                          placeholder="https://..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmAddItem(catIdx)}
                          disabled={!newItem.name.trim() || !newItem.price.trim()}
                          className="bg-pink-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Add Item
                        </button>
                        <button
                          onClick={() => { setAddingToCat(null); setNewItem(emptyItem()); }}
                          className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3">
                    <button
                      onClick={() => { setAddingToCat(catIdx); setEditingItem(null); }}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium flex items-center gap-1.5 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add item to {category.title}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add new category */}
        {addingCategory ? (
          <div className="bg-white rounded-xl border border-dashed border-pink-300 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">New Category</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmAddCategory()}
                placeholder="e.g. Seasonal Specials"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                autoFocus
              />
              <button
                onClick={confirmAddCategory}
                disabled={!newCategoryName.trim()}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => { setAddingCategory(false); setNewCategoryName(''); }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCategory(true)}
            className="w-full bg-white rounded-xl border border-dashed border-gray-300 py-3.5 text-gray-500 hover:text-pink-600 hover:border-pink-300 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Category
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuManager;
