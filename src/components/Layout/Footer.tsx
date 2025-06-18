import React from 'react'

const Footer: React.FC = () => (
  <div>
    <footer className="mt-2 mb-2 h-4 text-xs text-muted-foreground flex items-center justify-center">
      © 2025 {import.meta.env.VITE_APP_NAME}. All rights reserved.
    </footer>
  </div>
)

export default Footer
