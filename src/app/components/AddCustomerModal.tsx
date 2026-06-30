import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  PersonAdd,
  Phone,
  Badge,
  Upload,
  CheckCircle,
} from '@mui/icons-material';

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: NewCustomer) => void;
}

export interface NewCustomer {
  fullName: string;
  phoneNumber: string;
  idType: string;
  idNumber: string;
  idPhoto?: File;
}

export default function AddCustomerModal({ open, onClose, onSave }: AddCustomerModalProps) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIdPhoto(event.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!idType) {
      newErrors.idType = 'ID type is required';
    }
    if (!idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        fullName,
        phoneNumber,
        idType,
        idNumber,
        idPhoto: idPhoto || undefined,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFullName('');
    setPhoneNumber('');
    setIdType('');
    setIdNumber('');
    setIdPhoto(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#1e3a8a',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAdd />
          <Typography variant="h6">Add New Customer (KYC)</Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAdd sx={{ color: '#1e3a8a' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            required
            placeholder="+234 800 000 0000"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: '#1e3a8a' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ position: 'relative' }}>
            <FormControl fullWidth required error={!!errors.idType}>
              <InputLabel>ID Type</InputLabel>
              <Select
                value={idType}
                label="ID Type"
                onChange={(e) => setIdType(e.target.value)}
              >
                <MenuItem value="NIN">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge sx={{ color: '#1e3a8a', fontSize: 20 }} />
                    National Identity Number (NIN)
                  </Box>
                </MenuItem>
                <MenuItem value="Passport">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge sx={{ color: '#1e3a8a', fontSize: 20 }} />
                    International Passport
                  </Box>
                </MenuItem>
                <MenuItem value="DriversLicense">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge sx={{ color: '#1e3a8a', fontSize: 20 }} />
                    Driver's License
                  </Box>
                </MenuItem>
              </Select>
              {errors.idType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.idType}
                </Typography>
              )}
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="ID Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            error={!!errors.idNumber}
            helperText={errors.idNumber}
            required
            placeholder="Enter ID number"
          />

          <Box
            sx={{
              border: '2px dashed #cbd5e1',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#1e3a8a',
                bgcolor: '#f0f9ff',
              },
            }}
          >
            <input
              type="file"
              id="id-photo-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="id-photo-upload" style={{ cursor: 'pointer' }}>
              <Upload sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {idPhoto ? idPhoto.name : 'Upload ID Photo (Optional)'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Click to browse or drag and drop
              </Typography>
              {idPhoto && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#dcfce7',
                    color: '#16a34a',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                  }}
                >
                  <CheckCircle fontSize="small" />
                  <Typography variant="body2">File uploaded</Typography>
                </Box>
              )}
            </label>
          </Box>

          <Box
            sx={{
              bgcolor: '#fef3c7',
              p: 2,
              borderRadius: 1,
              border: '1px solid #fde047',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              <strong>Note:</strong> Customer information will be verified and stored securely
              in compliance with KYC regulations.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: '#cbd5e1',
            color: '#64748b',
            '&:hover': {
              borderColor: '#94a3b8',
              bgcolor: '#f8fafc',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<CheckCircle />}
          sx={{
            bgcolor: '#16a34a',
            '&:hover': { bgcolor: '#15803d' },
            px: 3,
          }}
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
