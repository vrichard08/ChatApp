using Microsoft.EntityFrameworkCore;

namespace ChatApp.Data
{
    public  class Repository<T> : IRepository<T> where T : class
    {
        protected ApplicationDbContext ctx;
        private DbSet<T> table;

        public Repository(ApplicationDbContext ctx)
        {
            this.ctx = ctx;
            table = ctx.Set<T>();   
        }
        public IEnumerable<T> GetAll()
        {
            return table.ToList();
        }
        public T GetById(object id)
        {
            return table.Find(id);
        }

        public void Insert(T obj)
        {
            table.Add(obj);
        }

        public void Update(T obj)
        {
            table.Attach(obj);
            ctx.Entry(obj).State = EntityState.Modified;
        }
        public void Delete(object id)
        {
            T existing = table.Find(id);
            table.Remove(existing);
        }
        public void Save()
        {
            ctx.SaveChanges();
        }

        public IQueryable<T> Table()
        {
            return table;
        }

    }
}
