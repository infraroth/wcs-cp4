import { useContext } from 'react';
import ArtContext from '../contexts/ArtContext';
import Artwork from '../components/Artwork';

const Gallery = () => {
  const { art } = useContext(ArtContext);
  return (
    <>
      {art.map((artwork) => (
        <Artwork key={artwork.id} artwork={artwork} />
      ))}
    </>
  );
};

export default Gallery;
