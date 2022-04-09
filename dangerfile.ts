import { danger, message } from 'danger'

message("hello danger");

const files = [...danger.git.modified_files, ...danger.git.created_files]

for (const file in files) {
  danger.git.structuredDiffForFile(file).then((diff) => {
    diff.chunks.forEach(chunk => {
      chunk.changes.forEach(change => {
        if (change.type === 'normal') {
          message(`${file}#${change.ln1}#${change.ln2}`, change.content);
        } else if (change.type === 'add') {
          message(`${file}#${change.ln}`, change.content)
        } else if (change.type === 'del') {
          message(`${file}#${change.ln}`, change.content)
        }
      })
    })
  })
}

