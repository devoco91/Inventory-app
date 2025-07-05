import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

export default function BarcodeScanner() {
  const [data, setData] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-xl fw-bold mb-4">Barcode Scanner</h1>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
        }}
      />
      <div className="mt-4">Scanned Code: <strong>{data}</strong></div>
    </div>
  );
}
