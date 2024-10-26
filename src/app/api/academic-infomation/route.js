import scraping from "./scraping";
import db from "../../../firebase"
import { doc, setDoc, collection } from "firebase/firestore";

export async function GET() {
    try {
        const loginID = process.env.LOGIN_ID
        const loginPassword = process.env.LOGIN_PASSWORD
        if(loginID === undefined || loginPassword === undefined) {
            return new Response('Login ID or Password is not defined', { status: 500 }); // エラー時のレスポンス
        }

        const data = await scraping(loginID, loginPassword); // scraping関数を呼び出す
        if (data) {
            const userDocRef = doc(collection(db, loginID), "academic-infomation")
            const subCollectionRef = doc(collection(userDocRef, "academic-infomation"), "basic-data")

            await setDoc(subCollectionRef, data)

            return new Response({message: "data save completed"}, { status: 200 }); // 成功時のレスポンス
        } else {
            return new Response('No data available', { status: 404 }); // データがない場合のレスポンス
        }
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 }); // エラー時のレスポンス
    }
}
