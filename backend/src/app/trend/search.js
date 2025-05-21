import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

async function getInstagramTrendsViaGoogle(keyword) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        const searchUrl = `https://www.google.com/search?q=site:instagram.com+${encodeURIComponent(
            keyword
        )}&tbm=isch`;

        await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#search img");

        const results = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll("#search img"));
            const alts = images.slice(0, 30).map((img) => img.alt);
            return alts.filter((alt) => {
                return alt !== "";
            });
        });
        return results;
    } catch (err) {
        console.error("Google/Instagram proxy search error:", err.message);
        return [];
    } finally {
        await browser.close();
    }
}
async function getXTrendsViaGoogle(keyword) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        const searchUrl = `https://www.google.com/search?q=site:x.com+${encodeURIComponent(
            keyword
        )}&tbm=isch`;

        await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#search img");

        const results = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll("#search img"));
            const alts = images.slice(0, 30).map((img) => img.alt);
            return alts.filter((alt) => {
                return alt !== "";
            });
        });

        return results;
    } catch (err) {
        console.error("Google/X proxy search error:", err.message);
        return [];
    } finally {
        await browser.close();
    }
}

async function getTiktokTrendsViaGoogle(keyword) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        const searchUrl = `https://www.google.com/search?q=site:tiktok.com+${encodeURIComponent(
            keyword
        )}&tbm=isch`;

        await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#search img");

        const results = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll("#search img"));
            const alts = images.slice(0, 30).map((img) => img.alt);
            return alts.filter((alt) => {
                return alt !== "";
            });
        });

        return results;
    } catch (err) {
        console.error("Google/TikTok proxy search error:", err.message);
        return [];
    } finally {
        await browser.close();
    }
}

async function getYoutubeTrendsViaGoogle(keyword) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        const searchUrl = `https://www.google.com/search?q=site:youtube.com+${encodeURIComponent(
            keyword
        )}&tbm=isch`;

        await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#search img");

        const results = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll("#search img"));
            const alts = images.slice(0, 30).map((img) => img.alt);
            return alts.filter((alt) => {
                return alt !== "";
            });
        });

        return results;
    } catch (err) {
        console.error("Google/Youtube proxy search error:", err.message);
        return [];
    } finally {
        await browser.close();
    }
}

export {
    getInstagramTrendsViaGoogle,
    getXTrendsViaGoogle,
    getTiktokTrendsViaGoogle,
    getYoutubeTrendsViaGoogle,
};
