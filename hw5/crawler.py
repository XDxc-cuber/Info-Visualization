from urllib.request import urlopen
from bs4 import BeautifulSoup as BS
from sqlalchemy import true

def showWebInfo(url):
    html = urlopen(url)
    bsObj = BS(html.read(), "html.parser")

    title = bsObj.title.text
    info = ""
    for span in bsObj.find(attrs={"class": "v_news_content"}).find_all('span'):
        if span.text == "阅读原文":
            break
        info += span.text
    
    print("\n标题：\n" + title)
    print("\n内容：\n\n" + info)
        


url = "http://chenhui.li/courses/infovis2022/05-EcnuNews.html"
html = urlopen(url)
bsObj = BS(html.read(), "html.parser")
table = bsObj.table

for a in table.find_all('a', href=True, text=True):
    showWebInfo(a['href'])

