// File: src/pages/AddAndEdit/Edit.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaUpload, FaTrash } from 'react-icons/fa';
import { useProducts } from '../../contexts/ProductContext';
import { productCategories } from '../../DataPack/Data';

// --- STYLED COMPONENTS ---
const PageWrapper = styled.div`
  background-color: var(--color-background-dark, #121212);
  color: var(--color-text-light, #FFFFFF);
  min-height: 100vh;
  padding: var(--spacing-m, 16px) var(--spacing-l, 24px) var(--spacing-xl, 32px);
  font-family: var(--font-body, "Inria Serif", serif);
`;
const BackButton = styled.button`
  background: none; border: none; color: white;
  font-size: 24px; cursor: pointer; 
  margin-top: 10px; 
  display: flex; align-items: center;
  &:hover { color: var(--color-secondary-peach, #FFDAB9); }
`;
const ProductContentWrapper = styled.div`
  background-color: var(--color-primary-purple, #5D3FD3);
  padding: 32px; border-radius: 12px; display: flex; gap: 32px;
  @media (max-width: 768px) { flex-direction: column; padding: 24px; }
  margin-top: 10px; 
`;
const ImageColumn = styled.div`
  flex: 0 0 40%; display: flex; flex-direction: column; align-items: center; 
  margin-top: 10px; 
`;
const MainProductImage = styled.img`
  width: 100%; max-width: 350px; height: auto; object-fit: contain;
  background-color: white; border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  aspect-ratio: 1 / 1;
  margin-top: 10px; 
`;
const UploadButton = styled.button`
    background-color: #ffffff;
    color: #5D3FD3;
    padding: 10px 20px; border: none; border-radius: 8px;
    font-size: 1rem; font-weight: bold; cursor: pointer;
    display: flex; align-items: center; margin-top: 20px;
    transition: background-color 0.2s ease, transform 0.1s ease;
    &:hover { background-color: #f0f0f0; transform: translateY(-2px); }
`;
const HiddenFileInput = styled.input`
    display: none;
`;
const DetailsColumn = styled.div`
  flex: 1; color: white; display: flex; flex-direction: column;
`;
const Form = styled.form`
    display: flex; flex-direction: column; margin-top: 10px; 
`;
const Label = styled.label`
    font-size: 0.9rem; font-weight: 600; margin-top: 10px; 
    color: var(--color-neutral-gray-light);
`;
const Input = styled.input`
    background-color: white; color: #333;
    border: 1px solid #ccc; border-radius: 6px;
    padding: 10px; font-size: 1rem; width: 100%; box-sizing: border-box;
    &:focus { outline: 2px solid var(--color-secondary-peach); }
    margin-top: 10px; 
`;
const TextArea = styled.textarea`
    background-color: white; color: #333;
    border: 1px solid #ccc; border-radius: 6px;
    padding: 10px; font-size: 1rem; width: 100%; box-sizing: border-box;
    min-height: 80px; resize: vertical; font-family: inherit;
    &:focus { outline: 2px solid var(--color-secondary-peach); }
    margin-top: 10px; 
`;
const Select = styled.select`
    background-color: white; color: #333;
    border: 1px solid #ccc; border-radius: 6px;
    padding: 10px; font-size: 1rem; width: 100%; box-sizing: border-box;
    &:focus { outline: 2px solid var(--color-secondary-peach); }
    margin-top: 10px; 
`;
const SubmitButton = styled.button`
  background-color: var(--color-secondary-peach);
  color: #181824;
  padding: 14px; border: none; border-radius: 8px;
  font-size: 1.1rem; font-weight: bold; cursor: pointer;
  margin-top: 20px; /* Added more margin-top */
  transition: background-color 0.2s ease, transform 0.1s ease;
  &:hover { background-color: var(--color-secondary-peach-dark); transform: translateY(-2px); }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;

// --- NEW DELETE BUTTON STYLE ---
const DeleteButton = styled.button`
  background-color: var(--color-error-red, #D32F2F);
  color: white;
  padding: 14px; border: none; border-radius: 8px;
  font-size: 1.1rem; font-weight: bold; cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s ease, transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover { background-color: #B71C1C; transform: translateY(-2px); }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;

const ErrorMessage = styled.p`
  color: var(--color-error, #FF6B6B);
  background-color: rgba(0,0,0,0.2);
  padding: 8px; border-radius: 4px; text-align: center;
`;

// --- The Edit Product Page Component ---
const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, updateProduct, deleteProduct, loading } = useProducts();

    const [formData, setFormData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await getProductById(id);
                if (productData) {
                    const tagsAsString = Array.isArray(productData.tags) ? productData.tags.join(', ') : '';
                    setFormData({ ...productData, tags: tagsAsString });
                } else {
                    setError("Product not found.");
                }
            } catch (err) {
                setError("Could not fetch product data.");
            }
        };
        fetchProductData();
    }, [id, getProductById]);

    const categoriesForForm = productCategories.filter(cat => cat !== 'All');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.imageUrl) {
            setError('Please ensure there is a product image.');
            return;
        }
        try {
            await updateProduct(id, formData);
            alert('Product updated successfully!');
            navigate(`/product/${id}`);
        } catch (err) {
            setError(err.message || 'Failed to update product.');
        }
    };

    // --- NEW DELETE HANDLER ---
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
            setError('');
            try {
                await deleteProduct(id);
                alert('Product deleted successfully!');
                navigate('/products'); // Navigate to the main products page after deletion
            } catch (err) {
                setError(err.message || 'Failed to delete product.');
            }
        }
    };

    if (!formData) {
        return <PageWrapper><div>Loading product data...</div></PageWrapper>;
    }

    return (
        <PageWrapper>
            <BackButton onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </BackButton>
            <ProductContentWrapper>
                <ImageColumn>
                    <MainProductImage src={formData.imageUrl || '/placeholder.png'} alt="Product image preview" />
                    <UploadButton type="button" onClick={() => document.getElementById('imageUpload').click()}>
                        <FaUpload /> Change Image
                    </UploadButton>
                    <HiddenFileInput id="imageUpload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                </ImageColumn>
                <DetailsColumn>
                    <Form onSubmit={handleSubmit}>
                        <Label htmlFor="name">Product Name</Label>
                        <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        
                        <Label htmlFor="description">Description</Label>
                        <TextArea name="description" id="description" value={formData.description} onChange={handleChange} required />
                        
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" id="category" value={formData.category} onChange={handleChange} required>
                            {categoriesForForm.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>
                        
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required />
                        
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} min="0" required />

                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., skimboard, pro, carbon" />
                        
                        <Label htmlFor="rating">Rating (0-5)</Label>
                        <Input type="number" name="rating" id="rating" value={formData.rating} onChange={handleChange} step="0.1" min="0" max="5" />
                        
                        <Label htmlFor="numRatings">Number of Ratings</Label>
                        <Input type="number" name="numRatings" id="numRatings" value={formData.numRatings} onChange={handleChange} min="0" />

                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </SubmitButton>
                        
                        {/* --- ADDED THE DELETE BUTTON --- */}
                        <DeleteButton type="button" disabled={loading} onClick={handleDelete}>
                            <FaTrash />
                            {loading ? 'Deleting...' : 'Delete Product'}
                        </DeleteButton>
                    </Form>
                </DetailsColumn>
            </ProductContentWrapper>
        </PageWrapper>
    );
};

export default EditProductPage;