// src/App.tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Use lazy loading to optimize bundle size
const HomePage = lazy(() => import("./pages/HomePage"));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Suspense>
    );
}

export default App;
