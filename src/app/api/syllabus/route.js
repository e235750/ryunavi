import * as cheerio from 'cheerio';
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import db from "../../../firebase"

export async function GET() {
    try {
        const userID = process.env.LOGIN_ID
        const userRef = doc(db, userID, "academic-infomation")
        const subCollectionRef = doc(userRef, "academic-infomation", "basic-data")
        const docSnap = await getDoc(subCollectionRef);

        //urlsの重複を削除
        const urls = new Set();
        if (docSnap.exists()) {
            for(let day in docSnap.data()){
                for(let period in docSnap.data()[day]){
                    urls.add(docSnap.data()[day][period].syllabusUrl)
                }
            }
        }

        //講義情報の取得
        const lecturesData = {}
        for(let url of urls){
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            const lectureRoom = $("#ctl00_phContents_Detail_dcl_room_name_lblCategory").text();
            const teachingFormat = $("#ctl00_phContents_Detail_dcl_teaching_format_lblCategory").text();
            const lectureYear = $("#ctl00_phContents_Detail_dcl_lct_year_lblCategory").text();
            const lecturePeriod = $("#ctl00_phContents_Detail_dcl_term_name_lblCategory").text();
            const dayPeriod = $("#ctl00_phContents_Detail_dcl_day_period_lblCategory").text();
            const lectureCode = $("#ctl00_phContents_Detail_dcl_syl_lct_cd_lblCategory").text();
            const numberOfCredits = $("#ctl00_phContents_Detail_dcl_credits_lblCategory").text();
            const teacherName = $("#ctl00_phContents_Detail_dcl_syl_staff_name_double_lblCategory a").text();
            const lecutureName = $("#ctl00_phContents_Detail_dcl_lct_name_double_lblCategory").text();
            const lectureFormat = ($("#ctl00_phContents_Detail_dcl_lct_Type_lblCategory").html() || "")
            const learningCategory = ($("#ctl00_phContents_Detail_dcl_active_learning_lblCategory").html() || "")
            const lectureContents = ($("#ctl00_phContents_Detail_dcl_outline_lblCategory").html() || "")
            const educationalGoals = ($("#ctl00_phContents_Detail_dcl_urgcc_lblCategory").html() || "")
            const lectureGoals = ($("#ctl00_phContents_Detail_dcl_target_lblCategory").html() || "")
            const evaluationMethod = ($("#ctl00_phContents_Detail_dcl_grading_lblCategory").html() || "")
            const requirements = ($("#ctl00_phContents_Detail_dcl_requirements_lblCategory").html() || "")
            const lecturePlan = ($("#ctl00_phContents_Detail_dcl_plan_lblCategory").html() || "")
            const preLearnig = ($("#ctl00_phContents_Detail_dcl_outside_info_lblCategory").html() || "")
            const textbookName = ($("#ctl00_phContents_Detail_ItemSyllabusTextBook_ItemBookTextBox_1_txtBookName_lbl").text() || "");
            const textbookRemarks = ($("#ctl00_phContents_Detail_dcl_t_note_lblCategory").html() || "");
            const textbookUrl = $("#ctl00_phContents_Detail_ItemSyllabusTextBook_ItemBookTextBox_1_txtBookName_lbl a").attr("href");
            const message = ($("#ctl00_phContents_Detail_dcl_message_lblCategory").html() || "").replace(/&[^;]*;/g, '');
            const email = ($("#ctl00_phContents_Detail_dcl_e_mail_lblCategory").html() || "")
            const refUrl = $("#ctl00_phContents_Detail_dcl_e_mail_lblCategory a").attr("href");
            console.log(message);

            const lectureData = {
                lectureRoom: lectureRoom !== undefined ? lectureRoom : "",
                teachingFormat: teachingFormat !== undefined ? teachingFormat : "",
                lectureYear: lectureYear !== undefined ? lectureYear : "",
                lecturePeriod: lecturePeriod !== undefined ? lecturePeriod : "",
                dayPeriod: dayPeriod !== undefined ? dayPeriod : "",
                lectureCode: lectureCode !== undefined ? lectureCode : "",
                numberOfCredits: numberOfCredits !== undefined ? numberOfCredits : "",
                teacherName: teacherName !== undefined ? teacherName : "",
                lecutureName: lecutureName !== undefined ? lecutureName : "",
                lectureFormat: lectureFormat !== undefined ? lectureFormat : "",
                learningCategory: learningCategory !== undefined ? learningCategory : "",
                lectureContents: lectureContents !== undefined ? lectureContents : "",
                educationalGoals: educationalGoals !== undefined ? educationalGoals : "",
                lectureGoals: lectureGoals !== undefined ? lectureGoals : "",
                evaluationMethod: evaluationMethod !== undefined ? evaluationMethod : "",
                requirements: requirements !== undefined ? requirements : "",
                lecturePlan: lecturePlan !== undefined ? lecturePlan : "",
                preLearnig: preLearnig !== undefined ? preLearnig : "",
                textbookName: textbookName !== undefined ? textbookName : "",
                textbookUrl: textbookUrl !== undefined ? textbookUrl : "",
                textbookRemarks: textbookRemarks !== undefined ? textbookRemarks : "",
                message: message !== undefined ? message : "",
                email: email !== undefined ? email : "",
                refUrl: refUrl !== undefined ? refUrl : ""
            }
            lecturesData[lectureCode] = lectureData;
        }

        //講義情報の情報をデータベースに保存
        const userDocRef = doc(db, userID, "academic-infomation")
        const subCollectionSyllabusRef = doc(collection(userDocRef, "academic-infomation"), "syllabus-data")
        await setDoc(subCollectionSyllabusRef, lecturesData);

        return new Response({message: 'syllabus data writtend'}, { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
