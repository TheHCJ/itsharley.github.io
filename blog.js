function convertMarkdownToHtml(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    lines.forEach(line => {
        if (line.startsWith('# ')) {
            html += `<h1>${line.substring(2)}</h1>`;
        } else if (line.startsWith('## ')) {
            html += `<h2>${line.substring(3)}</h2>`;
        } else if (line.startsWith('- ')) {
            html += `<li>${line.substring(2)}</li>`;
        } else {
            html += `<p>${line}</p>`;
        }
    });
    return html;
}

function loadBlogPost(filename) {
    fetch(`blog/${filename}`)
        .then(response => response.text())
        .then(markdown => {
            const content = convertMarkdownToHtml(markdown);
            document.getElementById('main-content').style.display = 'none';
            const blogContent = document.getElementById('blog-content');
            blogContent.innerHTML = `<button onclick="goBack()">Back</button>` + content;
            blogContent.style.display = 'block';
            window.location.hash = `#${filename}`;
        })
        .catch(error => console.error('Error loading blog post:', error));
}

function goBack() {
    document.getElementById('blog-content').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    window.location.hash = '';
}

function loadBlogList() {
    fetch('blog/index.json')
        .then(response => response.json())
        .then(posts => {
            const blogList = document.getElementById('blog-list');
            posts.forEach(post => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<p><a href="#${post.filename}" onclick="loadBlogPost('${post.filename}')">${post.date}: ${post.title}</a></p>`;
                blogList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading blog list:', error));
}

function loadBlogPostFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadBlogPost(hash);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlogList();
    loadBlogPostFromHash();
});

window.addEventListener('hashchange', loadBlogPostFromHash);