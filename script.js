"use strict";
window.onload = () => {
  function createActivityCard(container, data, scroll) {
    const date = new Date(data.date);
    const activityCardTemplate = `
      <div class="activity-card-title-container">
        <p class="subtitle">${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}</p>
        <h3 class="activity-card-title">${data.title}</h3>
      </div>
    `;
    const newActivityCardTable = document.createElement('div');
    const newActivityCard = document.createElement('article');
    newActivityCard.innerHTML = activityCardTemplate;
    newActivityCard.classList.add('activity-card');
    newActivityCardTable.classList.add('activity-card-table');

    let idx = 0;
    for (const key in data) {
      if (key === 'title' || key === 'date') continue;
      let col = document.createElement('div');
      col.id = `${data.date}-${idx}`;
      let cell = document.createElement('p');
      cell.textContent = key;
      cell.classList.add('subtitle');
      col.appendChild(cell);
      for (let point of data[key]) {
        let cell = document.createElement('p');
        cell.textContent = point;
        cell.classList.add('cell');
        col.appendChild(cell);
      }
      newActivityCardTable.appendChild(col);
      idx++;
    }
    newActivityCard.appendChild(newActivityCardTable);
    container.insertBefore(newActivityCard, container.children[0]);
    if (scroll) newActivityCard.scrollIntoView({ behavior: 'smooth' });
  }

  function createActivityForm(container) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const date = now.toUTCString();
    const newActivityCard = document.createElement('article');
    const activityCardTemplate = `
      <div class="activity-card-title-container">
        <input id="${date}" class="subtitle" type="text" placeholder="${day} ${month} ${year}, ${hours}:${minutes}"></input>
        <input id="${date}-title" class="activity-card-title" type="text" placeholder="New activity"></input>
      </div>
      <div class="activity-card-table">
        <div id="${date}-0">
          <p class="subtitle">exercise</p>
          <input class="table-row cell" type="text" placeholder="New exercise" size="2"></input>
          <button id="${date}-add-button" class="subtitle outline-button">Add exercise</button> 
        </div>
        <div id="${date}-1">
          <p class="subtitle">sets</p>
          <input class="table-row cell" type="number" placeholder="5" size="2"></input>
          <button id="${date}-save-button" class="subtitle fill-button">Save</button> 
        </div>
        <div id="${date}-2">
          <p class="subtitle">reps</p>
          <input class="table-row cell" type="number" placeholder="5" size="2"></input>
        </div>
        <div id="${date}-3">
          <p class="subtitle">rest</p>
          <input class="table-row cell" type="number" placeholder="30" size="2"></input>
        </div>
      </div>
    `;
    newActivityCard.innerHTML = activityCardTemplate;
    newActivityCard.classList.add('activity-card');
    
    new Promise((resolve) => {
      resolve(container.insertBefore(newActivityCard, container.children[0]));
    }).then(() => {
      newActivityCard.scrollIntoView({ behavior: 'smooth' });
      const addButton = document.getElementById(`${date}-add-button`);
      const saveButton = document.getElementById(`${date}-save-button`);
      saveButton.addEventListener('pointerdown', (event) => {
        saveButton.classList.add('clickback');

        let j;
        const rest = [];
        const reps = [];
        const sets = [];
        const exercise = [];
        const col0 = document.getElementById(`${date}-0`).getElementsByTagName('input');
        const col1 = document.getElementById(`${date}-1`).getElementsByTagName('input');
        const col2 = document.getElementById(`${date}-2`).getElementsByTagName('input');
        const col3 = document.getElementById(`${date}-3`).getElementsByTagName('input');
        const userDate = new Date(Date.parse(document.getElementById(`${date}`).value));
        console.log(userDate);


        for (j = 0; j < col0.length; j++) {
          if (col0[j].value && typeof col0[j].value === 'string') {
            exercise.push(col0[j].value);
          }
        }
        for (j = 0; j < col1.length; j++) {
          if (isNaN(col1[j].value)) continue
          else sets.push(col1[j].value);
        }
        for (j = 0; j < col2.length; j++) {
          if (isNaN(col2[j].value)) continue
          else reps.push(col2[j].value);
        }
        for (j = 0; j < col3.length; j++) {
          if (isNaN(col3[j].value)) continue
          else rest.push(col3[j].value);
        }

        const activity = {
          title: document.getElementById(`${date}-title`).value,
          date: (userDate == 'Invalid Date') ? date : userDate,
          exercise: exercise,
          sets: sets,
          reps: reps,
          rest: rest
        };
        activities.push(activity);
        createActivityCard(activitiesContainer, activity, true);
        localStorage.setItem('pocket-logbook-activities', JSON.stringify(activities));
      });
      saveButton.addEventListener('animationend', () => {
        saveButton.classList.remove('clickback');
        newActivityCard.remove();
      });
      addButton.addEventListener('pointerdown', (event) => {
        addButton.classList.add('backclick');

        const col0 = document.getElementById(`${date}-0`);
        const col1 = document.getElementById(`${date}-1`);
        const input0 = document.createElement('input');
        const input1 = document.createElement('input');
        input0.classList.add('table-row');
        input1.classList.add('table-row');
        input0.classList.add('cell');
        input1.classList.add('cell');
        input0.size = 2;
        input1.size = 2;
        input0.type = 'text';
        input1.type = 'number';
        input0.placeholder = 'New exercise';
        input1.placeholder = 0;
        col0.insertBefore(input0, col0.children[col0.children.length - 1]);
        col1.insertBefore(input1, col1.children[col1.children.length - 1]);
        const col2 = document.getElementById(`${date}-2`).appendChild(input1.cloneNode());
        const col3 = document.getElementById(`${date}-3`).appendChild(input1.cloneNode());
      });
      addButton.addEventListener('animationend', () => {
        addButton.classList.remove('backclick');
      });
    });
  }

  let activities = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const activitiesContainer = document.getElementById('activities');
  const addActivityFab = document.getElementById('add-activity');
  const exportButton = document.getElementById('export-button');

  if (localStorage.getItem('pocket-logbook-activities')) {
    activities = JSON.parse(localStorage.getItem('pocket-logbook-activities'));
    for (let activity in activities)
      createActivityCard(activitiesContainer, activities[activity], false);
  }

  addActivityFab.addEventListener('pointerdown', () => {
    addActivityFab.classList.add('clickback');
  });
  addActivityFab.addEventListener('animationend', () => {
    addActivityFab.classList.remove('clickback');
    createActivityForm(activitiesContainer);
  });

  exportButton.addEventListener('pointerdown', () => {
    exportButton.classList.add('backclick');
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      const popUp = document.createElement('p');
      popUp.classList.add('popup');
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(JSON.stringify(activities)).then(
          () => { popUp.textContent = 'Acitivities are now in clipboard'; },
          () => { popUp.textContent = 'Failed to copy activities'; },
        );
      }
      else {
        popUp.textContent = 'Cannot access clipboard';
      }
      activitiesContainer.appendChild(popUp);
    });
  });
  exportButton.addEventListener('animationend', () => {
    exportButton.classList.remove('backclick');
    for (let p of document.getElementsByClassName('popup'))
      p.remove();
  });

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/logbook/sw.js', {
      scope: '/logbook/'
    });
  }
};
