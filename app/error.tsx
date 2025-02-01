'use client';

import { Suspense, useEffect } from "react";
import EmptyState from "./components/EmptyState";
import Loader from "./components/Loader";

interface ErrorStateProps {
    error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Suspense fallback={<Loader />}>
            <EmptyState
                title="Oops"
                subtitle="Something went wrong!"
            />
        </Suspense>
    );
}

export default ErrorState;