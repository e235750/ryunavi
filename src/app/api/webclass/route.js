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
            return new Response(JSON.stringify('Login ID or Password is not defined'), { status: 500 });
        }

        browser = await puppeteer.launch({
            headless: true, // ヘッドレスモードで起動
            slowMo: 0,      // 遅延なし
            args: [
                '--no-sandbox',                // サンドボックスを無効化
                '--disable-setuid-sandbox',    // セットUIDサンドボックスを無効化
                '--disable-dev-shm-usage',     // `/dev/shm` の使用を無効化
                '--disable-accelerated-2d-canvas', // 2Dキャンバスのアクセラレーションを無効化
                '--disable-gpu',               // GPUの使用を無効化（Linuxの一部環境向け）
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
        // const topURL = process.env.WEBCLASS_TOP_URL + "/index.php?year=2024&semester=1";
        const topURL = process.env.WEBCLASS_TOP_URL;
        if (!loginURL || !topURL) {
            throw new Error('Login URL or Top URL is not defined');
        }

        // ログイン
        try {
            await page.goto(loginURL);
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        } catch (error) {
            console.error('Error navigating to login page:', error);
            if(browser) {
                await browser.close();
            }
            return new Response(JSON.stringify('Error navigating to login page'), { status: 500 });
        }

        await page.type('#username', userID);
        await page.type('#password', password);

        await Promise.all([
            page.click('#LoginBtn'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        const pageTitle = await page.title();
        // トップページに遷移
        try {
            await page.goto(topURL);
        } catch (error) {
            console.error('Error navigating to top page:', error);
            if(browser) {
                await browser.close();
            }
            return new Response(JSON.stringify('Error navigating to top page'), { status: 500 });
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
        if(browser) {
            await browser.close();
        }
        const lectuterData = {}
        htmls.forEach(html => {
            const report = []
            const selfLearning = []
            let $ = cheerio.load(html);
            const lectureName =  $(".course-name").text()
            const contentInfo = $(".cl-contentsList_contentInfo")
            contentInfo.each((i, elm) => {
                const categoryLabel = $(elm).find(".cl-contentsList_categoryLabel").text();
                const contentName = $(elm).find(".cm-contentsList_contentName").text();
                const deadline = $(elm).find(".cm-contentsList_contentDetailListItemData").text();

                if (categoryLabel === "自習") {
                    const selfLearningData = {
                        selfLearningName: contentName,
                        category: "自習",
                        startDate: [],
                        startTime: [],
                        endDate: [],
                        endTime: [],
                    };
                    if (deadline) {
                        const dateData = deadline.split("-");
                        const [startDateStr, endDateStr] = dateData.map((d) => d.trim().split(" "));
                        selfLearningData.startDate = startDateStr[0]?.split("/") || [];
                        selfLearningData.startTime = startDateStr[1]?.split(":") || [];
                        selfLearningData.endDate = endDateStr[0]?.split("/") || [];
                        selfLearningData.endTime = endDateStr[1]?.split(":") || [];
                    }
                    selfLearning.push(selfLearningData);
                } else if (categoryLabel === "レポート") {
                    const reportData = {
                        reportName: contentName,
                        category: "レポート",
                        startDate: [],
                        startTime: [],
                        endDate: [],
                        endTime: [],
                    };
                    if (deadline) {
                        const dateData = deadline.split("-");
                        const [startDateStr, endDateStr] = dateData.map((d) => d.trim().split(" "));
                        reportData.startDate = startDateStr[0]?.split("/") || [];
                        reportData.startTime = startDateStr[1]?.split(":") || [];
                        reportData.endDate = endDateStr[0]?.split("/") || [];
                        reportData.endTime = endDateStr[1]?.split(":") || [];
                    }
                    report.push(reportData);
                }
            });
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
        return new Response(JSON.stringify('Internal Server Error'), { status: 500 });
    }
}
