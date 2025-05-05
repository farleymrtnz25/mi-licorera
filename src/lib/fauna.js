import faunadb from 'faunadb';
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

export const addProduct = (name, quantity) =>
  client.query(
    q.Create(q.Collection('products'), { data: { name, quantity, sold: 0 } })
  );

export const sellProduct = (id, soldQty) =>
  client.query(
    q.Let(
      {
        ref: q.Ref(q.Collection('products'), id),
        data: q.Get(q.Var('ref'))
      },
      q.Update(q.Var('ref'), {
        data: {
          quantity: q.Select(['data', 'quantity'], q.Var('data')) - soldQty,
          sold: q.Select(['data', 'sold'], q.Var('data')) + soldQty
        }
      })
    )
  );

export const getProducts = () =>
  client.query(
    q.Map(q.Paginate(q.Documents(q.Collection('products'))), ref => q.Get(ref))
  );