import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { CategoryPayload, Category } from '../../api/category';

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../hooks/useCategory';

import CategoryForm from '../../components/categories/CategoryForm';
import CategoryTable from '../../components/categories/CategoryTable';

/* =========================
   Helpers
========================= */

function extractApiError(error: any, fallback: string) {
  return (
    error?.response?.data?.details?.[0] ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function AdminCategories() {
  /* =========================
     Pagination State
  ========================= */

  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading } = useCategories(page, perPage);

  const categories: Category[] = data?.data ?? [];
  const meta = data?.meta;

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  /* =========================
     Handlers
  ========================= */

  const handleCreate = async (payload: CategoryPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success('Category created');
      setIsCreateOpen(false);
    } catch (error) {
      toast.error(extractApiError(error, 'Failed to create category'));
    }
  };

  const handleUpdate = async (payload: Partial<CategoryPayload>) => {
    if (!selectedCategory) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedCategory.id,
        payload,
      });
      toast.success('Category updated');
      setIsEditOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(extractApiError(error, 'Failed to update category'));
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteMutation.mutateAsync(selectedCategory.id);
      toast.success('Category deleted');
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(extractApiError(error, 'Failed to delete category'));
    }
  };

  /* =========================
     Render
  ========================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Categories
          </h1>
          <p className="text-neutral-600">
            Manage product categories
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        {isLoading ? (
          <table className="w-full">
            <tbody className="divide-y">
              {[...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} columns={4} />
              ))}
            </tbody>
          </table>
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={(cat) => {
              setSelectedCategory(cat);
              setIsEditOpen(true);
            }}
            onDelete={(cat) => {
              setSelectedCategory(cat);
              setIsDeleteOpen(true);
            }}
          />
        )}
      </Card>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-neutral-600">
            Page {meta.current_page} of {meta.total_pages}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={meta.current_page === 1}
              onClick={() =>
                setPage((p) => Math.max(p - 1, 1))
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={meta.current_page === meta.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Category"
      >
        <CategoryForm
          onSubmit={handleCreate}
          submitText="Create"
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Category"
      >
        {selectedCategory && (
          <CategoryForm
            initialData={selectedCategory}
            onSubmit={handleUpdate}
            submitText="Update"
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Delete "${selectedCategory?.name}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}