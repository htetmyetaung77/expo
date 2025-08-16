import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 999,
    image: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPhone+15+Pro',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    category: 'Electronics',
    rating: 4.8,
    stock: 25,
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    price: 1199,
    image: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=MacBook+Air',
    description: 'Supercharged by M2 chip. Incredibly thin and light laptop with all-day battery life.',
    category: 'Electronics',
    rating: 4.9,
    stock: 15,
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    image: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=AirPods+Pro',
    description: 'Active Noise Cancellation, Transparency mode, and spatial audio.',
    category: 'Electronics',
    rating: 4.7,
    stock: 50,
  },
  {
    id: 4,
    name: 'Nike Air Max 270',
    price: 150,
    image: 'https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Nike+Air+Max',
    description: 'Comfortable running shoes with Max Air unit for all-day comfort.',
    category: 'Fashion',
    rating: 4.5,
    stock: 30,
  },
  {
    id: 5,
    name: 'Levi\'s 501 Jeans',
    price: 89,
    image: 'https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Levis+501',
    description: 'Classic straight-leg jeans. The original blue jean since 1873.',
    category: 'Fashion',
    rating: 4.6,
    stock: 40,
  },
  {
    id: 6,
    name: 'The Great Gatsby',
    price: 12,
    image: 'https://via.placeholder.com/300x300/28A745/FFFFFF?text=Great+Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald.',
    category: 'Books',
    rating: 4.4,
    stock: 100,
  },
];

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts,
    categories: ['All', 'Electronics', 'Fashion', 'Books'],
    selectedCategory: 'All',
    searchQuery: '',
    filteredItems: initialProducts,
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredItems = state.selectedCategory === 'All' 
        ? state.items.filter(item => 
            item.name.toLowerCase().includes(state.searchQuery.toLowerCase())
          )
        : state.items.filter(item => 
            item.category === state.selectedCategory &&
            item.name.toLowerCase().includes(state.searchQuery.toLowerCase())
          );
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredItems = state.selectedCategory === 'All'
        ? state.items.filter(item => 
            item.name.toLowerCase().includes(state.searchQuery.toLowerCase())
          )
        : state.items.filter(item => 
            item.category === state.selectedCategory &&
            item.name.toLowerCase().includes(state.searchQuery.toLowerCase())
          );
    },
    updateStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.items.find(item => item.id === id);
      if (product) {
        product.stock -= quantity;
      }
    },
  },
});

export const { setCategory, setSearchQuery, updateStock } = productsSlice.actions;
export default productsSlice.reducer;