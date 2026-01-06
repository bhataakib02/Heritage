'use client'

import { Spinner } from '@nextui-org/react'
import React from 'react'

function loading() {
  return (
      <div className="flex h-screen fixed justify-center items-center inset-0">
          <Spinner size="lg" />
    </div>
  )
}

export default loading