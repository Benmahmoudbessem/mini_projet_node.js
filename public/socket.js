const socket = io();
socket.on('taskAdded', task => {
  alert('Nouvelle tâche ajoutée : ' + task.title);
  location.reload();
});
socket.on('taskDeleted', id => {
  alert('Tâche supprimée');
  location.reload();
});
socket.on('taskUpdated', task => {
  alert(`Tâche "${task.title}" mise à jour en "${task.status}"`);
  location.reload();
});