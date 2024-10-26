import * as cheerio from 'cheerio'; 
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

const scraping = async (loginID, loginPassword) => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, // headless: false はブラウザを表示する
            slowMo: 0,
            args: [
               '--no-sandbox',  // サンドボックスモードの無効化
               '--disable-setuid-sandbox',
               '--disable-dev-shm-usage',
               '--disable-accelerated-2d-canvas',
               '--disable-gpu'
           ], }); 

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();  // リソースを無視
        } else {
        req.continue();
        }
        });

        const loginURL = process.env.ACADEMIC_INFOMATION_LOGIN_URL
        const topURL = process.env.ACADEMIC_INFOMATION_TOP_URL
        const timeTableURL = process.env.ACADEMIC_INFOMATION_REGISTER_URL
        if (!loginURL || !topURL || !loginID || !loginPassword || !timeTableURL) {
        throw new Error('Login URL, Top URL, Login ID or Password is not defined');
        }

        //ログイン
        try {
            await page.goto(loginURL);
        } catch (error) {
            console.error('Error navigating to login page:', error);
            await browser.close();
            return;
        }

        await page.type('#txtID', loginID);
        await page.type('#txtPassWord', loginPassword);

        await Promise.all([
        page.click('#ctl22_btnLogin'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])

        //ログイン後のTopページに遷移
        try {
            await page.goto(topURL);
        } catch (error) {
            console.error('Error navigating to top page:', error);
            await browser.close();
            return;
        }

        await Promise.all([
        page.click('#ctl00_bhHeader_ctl15_lnk'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])

        await page.goto(process.env.BLANK_PAGE_URL);

        await Promise.all([
        page.click('#ctl00_bhHeader_ctl29_lnk'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])

        //科目リストページに遷移
        try {
            await page.goto(timeTableURL);
        } catch (error) {
            console.error('Error navigating to time table page:', error);
            await browser.close();
            return;
        }

        const html = await page.content();
        if(!html) {
            throw new Error('HTML data is undefined or null');
        }
        await browser.close();

        let $ = cheerio.load(html);
        const weekday = [{'Mon': 1}, {'Tue': 2}, {'Wed': 3}, {'Thu': 4}, {'Fri': 5}, {'Sat': 6}];
        //xpathのMon1, Tue1, Wed1, Thu1, Fri1, Sat1の部分を変えることで曜日ごとの時間割を取得できる
        //*[@id="ctl00_phContents_rrMain_ttTable_lctMon1_ctl00_lblSbjName"]/a
        const lecturesData = {}
        for(let date of weekday) {
        const day = Object.keys(date)[0];
        const dayNum = Object.values(date)[0];
        const dayData = {};
        for (let period = 1; period <= 6; period++) {
            // 科目名の取得
            const selectorLectureName = `#ctl00_phContents_rrMain_ttTable_lct${day}${period}_ctl00_lblSbjName`;
            const selectorLectureName2 = `#ctl00_phContents_rrMain_ttTable_lct${day}${period}_ctl02_lblSbjName`;
            const elementName = $(selectorLectureName);
            const elementName2 = $(selectorLectureName2);
            console.log(elementName2.text());
            if (elementName.text().length > 1) {
                // 科目番号の取得
                const selectorLectureCode = `#ctl00_phContents_rrMain_ttTable_lct${day}${period}_ctl00_lblLctCd`;
                const elementLectureCode = $(selectorLectureCode);

                const syllabusUrl = `https://tiglon.jim.u-ryukyu.ac.jp/portal/Public/Syllabus/DetailMain.aspx?lct_year=2024&lct_cd=${elementLectureCode.text()}&je_cd=1`;

                // dataをlecturesDataに追加
                dayData[period - 1] = {
                    lectureName: elementName.text(),
                    syllabusUrl: syllabusUrl,
                    lectureCode: elementLectureCode.text()
                };

                if (elementName2.text().length > 1) {
                    const selectorLectureCode2 = `#ctl00_phContents_rrMain_ttTable_lct${day}${period}_ctl02_lblLctCd`;
                    const elementLectureCode2 = $(selectorLectureCode2);
                    const syllabusUrl = `https://tiglon.jim.u-ryukyu.ac.jp/portal/Public/Syllabus/DetailMain.aspx?lct_year=2024&lct_cd=${elementLectureCode2.text()}&je_cd=1`;

                    dayData[`${period - 1}_02`] = {
                        lectureName: elementName2.text(),
                        syllabusUrl: syllabusUrl,
                        lectureCode: elementLectureCode2.text(),
                    };
                }
            }
        }
        lecturesData[dayNum - 1] = dayData;
    }
        return lecturesData;
    } catch (error) {
        console.error('Error:', error);
        await browser.close();
        return {};
    }
}

module.exports = scraping;