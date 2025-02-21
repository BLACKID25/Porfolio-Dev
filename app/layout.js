export const metadata={
    title: 'Home',
    description: 'Generate by Next.js'
}

export default function RootLayout({ children }) {
    return (
      <html lang="es">
        <body>
          {children}
        </body>
      </html>
    );
  }