import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <nav className='flex items-center gap-4'>
        <Link href={'/customers'}>Clientes</Link>
        <Link href={'/sales'}>Ventas</Link>
    </nav>
  )
}

export default Navbar