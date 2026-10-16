# Метаданные mukha.design

Метатеги находятся непосредственно в `<head>` файла `index.html`; JavaScript и сборка не нужны.
Корень этого репозитория — публичная директория GitHub Pages. CNAME сохраняет домен mukha.design.

## Обложка

Файл `og-cover.png` (1200 × 630) находится в корне рядом с `index.html`.
В HTML включены `og:image`, размеры 1200 × 630, MIME-тип image/png и `twitter:image`.
Оба URL: https://mukha.design/og-cover.png.
Публиковать HTML и изображение нужно вместе через обычный деплой GitHub Pages.
Для будущих обновлений заменяйте этот файл, сохраняя имя и размеры.

## Проверка после публикации

- Открыть исходный код https://mukha.design/ и проверить title, description, canonical, Open Graph и Twitter Cards.
- Проверить /robots.txt, /sitemap.xml, /assets/favicon.svg и /apple-touch-icon.png.
- Telegram: отправить URL в «Избранное»; при устаревшем превью попробовать обновление через @WebpageBot, затем отправить ссылку новым сообщением.
- Facebook: https://developers.facebook.com/tools/debug/ — проверить URL и запросить повторное сканирование.
- В остальных мессенджерах проверить новое сообщение с URL после публикации. Старые сообщения могут сохранять закешированную карточку.

Sitemap содержит главную и три актуальных кейса. Архивные копии index-original.html и index_.html исключены из sitemap и закрыты для обхода в robots.txt (это не средство защиты файлов).
Apple Touch Icon повторяет существующий синий круг favicon на фоне сайта; визуальная часть страницы не изменена.
