import React from 'react'
import {Link} from "react-router-dom"

export default function Index() {
  return (
    <>
    <div>

    <Link to="/test">
    <button >Test</button>
    </Link>

    <Link to="/board">
    <button >Board</button>
    </Link>
    <Link to="/test-2">
    <button >Test2</button>
    </Link>
    <Link to="/test-3">
    <button >Test3</button>
    </Link>
    <Link to="/test-4">
    <button >Test4</button>
    </Link>
    </div>

    </>
  )
}
