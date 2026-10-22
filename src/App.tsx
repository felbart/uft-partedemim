import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router'
import { BingoPage } from './features/bingo/BingoPage'

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><Routes>
    <Route path="/" element={<Navigate to="/bingo" replace />} />
    <Route path="/bingo" element={<BingoPage />} />
    <Route path="*" element={<main className="mx-auto my-20 max-w-bingo p-6"><h1 className="h1 mb-6 text-title">Página não encontrada</h1><Link to="/bingo">Ir para o Bingo do Autocuidado</Link></main>} />
  </Routes></BrowserRouter>
}
