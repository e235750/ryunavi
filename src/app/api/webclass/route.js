import * as cheerio from 'cheerio'; 
import puppeteer from 'puppeteer';
import db from "../../../firebase"
import { doc, setDoc, collection } from "firebase/firestore";

export async function GET() {
    let browser;
    try {
        const userID = process.env.LOGIN_ID;
        const password = process.env.LOGIN_PASSWORD;
        if (!userID || !password) {
            return new Response('Login ID or Password is not defined', { status: 500 });
        }

        browser = await puppeteer.launch({
            headless: true,
            slowMo: 0,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
            ],
        });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort();  // 不要なリソースを無視
            } else {
                req.continue();
            }
        });

        const loginURL = process.env.WEBCLASS_LOGIN_URL;

        // トップページのURL（後期のwebclassはコンテンツ量が少ないため、前期のページ）
        const topURL = process.env.WEBCLASS_TOP_URL + "/index.php?year=2024&semester=1";
        if (!loginURL || !topURL) {
            throw new Error('Login URL or Top URL is not defined');
        }

        // ログイン
        try {
            await page.goto(loginURL);
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        } catch (error) {
            console.error('Error navigating to login page:', error);
            await browser.close();
            return new Response('Error navigating to login page', { status: 500 });
        }

        await page.type('#username', userID);
        await page.type('#password', password);

        await Promise.all([
            page.click('#LoginBtn'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        // トップページに遷移
        try {
            await page.goto(topURL);
        } catch (error) {
            console.error('Error navigating to top page:', error);
            await browser.close();
            return new Response('Error navigating to top page', { status: 500 });
        }

        //講義一覧の取得
        const lectures = await page.$$(".list-group-item.course")
        const courseList = new Set(lectures);

        //講義一覧からhrefを取得
        const urls = new Set()
        for (const course of courseList) {
            const url = await course.evaluate(e => e.href);
            urls.add(url);
        }

        const htmls = new Set();
        for (const url of urls) {
            try {
                await page.goto(url, { waitUntil: 'networkidle2' });
                const html = await page.content();
                htmls.add(html);
            } catch (error) {
                console.error('Error fetching HTML for URL:', url, error);
            }
        }
        await browser.close();
        const lectuterData = {}
        htmls.forEach(html => {
            const report = []
            const selfLearning = []
            let $ = cheerio.load(html);
            const lectureName =  $(".course-name").text()
            const contentInfo = $(".cl-contentsList_contentInfo")
            contentInfo.each((i, elm) => {
                if($(elm).find(".cl-contentsList_categoryLabel").text() === "自習") {
                    const selfLearningName = $(elm).find(".cm-contentsList_contentName").text()
                    const deadline = $(elm).find(".cm-contentsList_contentDetailListItemData").text()
                    let startDate = []
                    let startTime = []
                    let endDate = []
                    let endTime = []
                    if(deadline) {
                        const dateData = deadline.split("-")
                        startDate = dateData[0].trim().split(" ")[0].split("/")
                        startTime = dateData[0].trim().split(" ")[1].split(":")
                        endDate = dateData[1].trim().split(" ")[0].split("/")
                        endTime = dateData[1].trim().split(" ")[1].split(":")
                    }
                    const selfLearningData = {
                        selfLearningName: selfLearningName,
                        category: "自習",
                        startDate: startDate,
                        startTime: startTime,
                        endDate: endDate,
                        endTime: endTime
                    }
                    selfLearning.push(selfLearningData)
                }
                else if ($(elm).find(".cl-contentsList_categoryLabel").text() === "レポート") {
                    const reportName = $(elm).find(".cm-contentsList_contentName").text()
                    const deadline = $(elm).find(".cm-contentsList_contentDetailListItemData").text()
                    if(deadline) {

                    }
                    const dateData = deadline.split("-")
                    const startDate = dateData[0].trim().split(" ")[0].split("/")
                    const startTime = dateData[0].trim().split(" ")[1].split(":")
                    const endDate = dateData[1].trim().split(" ")[0].split("/")
                    const endTime = dateData[1].trim().split(" ")[1].split(":")
                    const reportData = {
                        reportName: reportName,
                        category: "レポート",
                        startDate: startDate,
                        startTime: startTime,
                        endDate: endDate,
                        endTime: endTime
                    }
                   report.push(reportData)
                }
            })
            lectuterData[lectureName] = {report: report, selfLearning: selfLearning}

            const userRef = doc(collection(db, userID), "webclass")
            setDoc(userRef, lectuterData)
        })

        return new Response(JSON.stringify({response: "written WebClass data"}), { status: 200 });
    } catch (error) {
        console.error(error);
        if (browser) {
            await browser.close();
        }
        return new Response('Internal Server Error', { status: 500 });
    }
}
