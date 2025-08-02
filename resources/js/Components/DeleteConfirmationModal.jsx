import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmText, 
    cancelText,
    isLoading = false 
}) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 flex w-12 h-12 block items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 my-auto" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold">
                                {title || t('common.deleteConfirmation')}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                                {description || t('common.deleteWarning')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {cancelText || t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                {t('common.deleting')}
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                {confirmText || t('common.delete')}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 