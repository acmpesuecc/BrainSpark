document.addEventListener("DOMContentLoaded", async () => {
    const issuesContainer = document.getElementById('issues-container');
  
    try {
      const response = await fetch('/api/issues');
      const issues = await response.json();
  
      issues.forEach(issue => {
        const issueCard = document.createElement('div');
        issueCard.classList.add('issue-card');
  
        issueCard.innerHTML = `
          <h3>${issue.title}</h3>
          <p>${issue.body || 'No description provided'}</p>
        `;
  
        issuesContainer.appendChild(issueCard);
      });
    } catch (error) {
      console.error('Error loading issues:', error);
    }
  });
  