import '~/init/dotenv';
import server from '~/lib/server';

//
// Run
//

const PORT = process.env.SERVER_PORT;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
