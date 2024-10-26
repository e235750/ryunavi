"use client"

import { useEffect } from "react";

const Page = () => {
    useEffect(() => {
        fetch('/api/webclass')
        .then (response => response.json())
        .then (data => console.log(data));
    }, []);

    return (
        <div>
            Page
        </div>
    );
}

export default Page;