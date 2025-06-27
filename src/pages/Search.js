import ProductCard from './ProductCard'; 
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import '../index.css';
import { initialProducts } from '../Data/ProductData';

const Wrapper = styled.div`
padding: 2rem;
background: linear-gradient(135deg, #101010 0%, #670097 100%);
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 500px; /* Added for better layout */
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  justify-content: center;
  display: block;
  margin: 0 auto 1rem auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;


const Search = () => {
  const [searchQuery, setSearchQuery]  = useSearchParams();
  const query = searchQuery.get('q') || '';

  const filteredProducts = initialProducts
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Wrapper>
      <h2 id='searchHeader'>Search Results for "{query}"</h2>
      <SearchInput
        type="search"
        placeholder="Search by name"
        value={query}
        onChange={e => {
          const newQuery = e.target.value;
          setSearchQuery({ q: newQuery }); //
        }}
      />
      {query && filteredProducts.length === 0 && (
        <p>No products found matching "{query}".</p>
      )}
      <ProductGrid>
        {filteredProducts.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </ProductGrid>
    </Wrapper>
  );
};

export default Search;