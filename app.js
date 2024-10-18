fetch('/sync-github-notion')
  .then(response => response.json())
  .then(data => {
    const issuesContainer = document.getElementById('issues');
    data.forEach(issue => {
      const div = document.createElement('div');
      div.classList.add('issue');
      div.innerHTML = `<h3>${issue.title}</h3><p>${issue.description}</p>`;
      issuesContainer.appendChild(div);
    });
  })
  .catch(error => console.error('Error fetching issues:', error));
