import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close,
  Print,
  CheckCircle,
} from '@mui/icons-material';

interface ReceiptData {
  transactionRef: string;
  branchName: string;
  dateTime: string;
  teller: string;
  customerName: string;
  transactionType: string;
  fromCurrency: string;
  fromAmount: number;
  exchangeRate: number;
  toCurrency: string;
  toAmount: number;
  charges: number;
  paymentMethod: string;
}

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
}

export default function ReceiptModal({ open, onClose, receiptData }: ReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!receiptData) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Close Button - Hidden on Print */}
          <Box
            className="no-print"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
              pb: 0,
            }}
          >
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Receipt Content */}
          <Box ref={printRef} sx={{ p: 4, pt: 2 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 0.5 }}>
                SAUCAM PRO
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Branch Operations Management System
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  bgcolor: '#dcfce7',
                  borderRadius: 1,
                }}
              >
                <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#16a34a' }}>
                  TRANSACTION RECEIPT
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Transaction Reference */}
            <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: '#f9fafb', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Transaction Reference
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a8a', mt: 0.5 }}>
                {receiptData.transactionRef}
              </Typography>
            </Box>

            {/* Transaction Details */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Branch Name:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {receiptData.branchName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Date & Time:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {receiptData.dateTime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Teller:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {receiptData.teller}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Customer Name:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {receiptData.customerName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Transaction Type:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {receiptData.transactionType}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Exchange Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#1e3a8a', fontWeight: 600 }}>
                Exchange Details
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  From Currency & Amount:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {receiptData.fromCurrency} {receiptData.fromAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, bgcolor: '#f0f9ff', p: 1.5, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Exchange Rate:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                  1 {receiptData.fromCurrency} = {receiptData.exchangeRate.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {receiptData.toCurrency}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  To Currency & Amount:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#16a34a' }}>
                  {receiptData.toCurrency} {receiptData.toAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Service Charges:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {receiptData.fromCurrency} {receiptData.charges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {receiptData.paymentMethod}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Important Notice */}
            <Box sx={{ bgcolor: '#fef3c7', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                IMPORTANT NOTICE
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                • Please retain this receipt for your records
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                • Funds are subject to availability and regulatory compliance
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                • Exchange rates may vary and are subject to market fluctuations
              </Typography>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '2px solid #e5e7eb' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e3a8a', mb: 1 }}>
                Saucam Pro Financial Services Limited
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                RC: 1234567 • Licensed by Central Bank of Nigeria
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Head Office: 123 Victoria Island, Lagos, Nigeria
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                24/7 Customer Helpline: +234 800 SAUCAM (728226)
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: '#94a3b8' }}>
                Thank you for your business
              </Typography>
            </Box>
          </Box>

          {/* Print Button - Hidden on Print */}
          <Box
            className="no-print"
            sx={{
              p: 3,
              pt: 0,
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: '#cbd5e1',
                color: '#64748b',
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
                minWidth: 120,
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{
                bgcolor: '#1e3a8a',
                '&:hover': { bgcolor: '#1e40af' },
                minWidth: 160,
              }}
            >
              Print Receipt
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            .no-print {
              display: none !important;
            }

            ${printRef.current ? `#${printRef.current.id}` : ''},
            ${printRef.current ? `#${printRef.current.id}` : ''} * {
              visibility: visible;
            }

            @page {
              margin: 0.5in;
              size: auto;
            }

            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}
      </style>
    </>
  );
}
