import QRCode from 'qrcode';

export async function generateQRCode(verificationId: string): Promise<string> {
  try {
    const verificationUrl = `${window.location.origin}/verify/${verificationId}`;
    console.log('Generating QR code for URL:', verificationUrl);
    
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log('QR code generated successfully');
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function downloadQRCode(verificationId: string, certificateTitle: string): Promise<void> {
  try {
    console.log('Downloading QR code for verification ID:', verificationId);
    
    const qrCodeDataUrl = await generateQRCode(verificationId);
    
    // Create download link
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `${certificateTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('QR code downloaded successfully');
  } catch (error) {
    console.error('Failed to download QR code:', error);
    throw new Error('Failed to download QR code');
  }
}
