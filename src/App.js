import './App.css';
import { Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import React, { useRef, useState, useEffect } from 'react';

function useImage() {
  const [image, setImage] = useState(null);

  const handleUpload = (file) => {
    const imageURL = URL.createObjectURL(file);
    setImage({ name: file.name, url: imageURL });
  };

  const handleRemove = () => {
    if (image) {
      URL.revokeObjectURL(image.url);
      setImage(null);
    }
  };

  return {
    image,
    handleUpload,
    handleRemove,
  };
}

function App() {
  const { image, handleUpload, handleRemove } = useImage();
  const [pixelInfo, setPixelInfo] = useState('');
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [asciimap, setAsciimap] = useState(" .-=+#@");
  const [showUploadArea, setShowUploadArea] = useState(true);

  const handleGetPixelInfo = () => {
    if (image) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image.url;

      img.onload = () => {
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        let pixelText = '';

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const grayScale = (pixel[0] + pixel[1] + pixel[2]) / 3;
            var portion = Math.round(Math.round(grayScale) / (256 / (asciimap.length - 1)));
            pixelText += asciimap[portion] + ' ';
          }
          pixelText += '\n';
        }

        setPixelInfo(pixelText);
      };
    }
  };

  const handleRemoveImage = () => {
    handleRemove();
    setShowUploadArea(true);
  };

  const handleAutoSize = () => {
    if (image) {
      const img = new Image();
      img.src = image.url;

      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
    }
  };

  useEffect(() => {
    setPixelInfo('');
  }, [image]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
      setShowUploadArea(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div>
      {showUploadArea && (
        <div className="upload-container">
          <div className='upload-area' {...getRootProps()}>
            <input {...getInputProps()} />
            <Button as="span">Drag or Upload Image</Button>
          </div>
        </div>
      )}

      <div>
        {image && (
          <div className="upload-container">
            <div className="container">
              <div className='left-container'>
                <img src={image.url} alt={image.name} style={{maxWidth: '80vh', maxHeight: '75vh' }} />
              </div>
              <div className='right-container'>
                <div class="column">
                  <div className="form__group field">
                    <input class="form__field" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                    <label className='form__label'>Width:</label>
                  </div>
                  <div className="form__group field">
                    <input class="form__field" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                    <label className='form__label'>Height:</label>
                  </div>
                  <div className="form__group field">
                    <input class="form__field" type="text" value={asciimap} onChange={(e) => setAsciimap(e.target.value)} />
                    <label className='form__label'>ASCIIMap:</label>
                  </div>
                </div>
                <div class="column">
                  <div className='button-container'>
                    <Button onClick={handleGetPixelInfo}className='normal-button'>轉換ASCII</Button>
                    <Button onClick={handleAutoSize} className='normal-button'>一鍵尺寸</Button>
                    <Button onClick={handleRemoveImage} className='remove-button'>移除圖片</Button>
                  </div>
                </div>
                <textarea
                  value={pixelInfo}
                  readOnly
                  rows={10}
                  cols={40}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
