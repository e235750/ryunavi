import scraping from "./scraping";

export async function GET() {
    try {
        const data = await scraping(); // scraping関数を呼び出す
        return new Response(JSON.stringify(data), { status: 200 }); // 成功時のレスポンス
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 }); // エラー時のレスポンス
    }
}
