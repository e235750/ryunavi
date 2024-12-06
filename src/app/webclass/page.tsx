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
            ああああ
        </div>
    );
}

export default Page;