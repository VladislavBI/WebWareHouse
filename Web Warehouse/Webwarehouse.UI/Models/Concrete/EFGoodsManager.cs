﻿using System.Collections.Generic;
using System.Linq;
using Webwarehouse.UI.Models.Abstract;
using Webwarehouse.UI.Models.Entities;

namespace Webwarehouse.UI.Models.Concrete
{
    /// <summary>
    /// Entity framework IGoodManager realization
    /// </summary>
    public class EfGoodManager : IGoodManager
    {
        /// <summary>
        /// database context
        /// </summary>
        private WarehouseContext _context;

        /// <summary>
        /// Adding good to base using entity framework
        /// </summary>
        /// <param name="good">good for add</param>
        public void AddGood(Good good)
        {
            using (_context = new WarehouseContext())
            {
                _context.Goods.Add(good);
                _context.SaveChanges();
            }
        }

        /// <summary>
        /// Check if good exist using entity framework
        /// </summary>
        /// <param name="goodName">name of good for check</param>
        /// <returns></returns>
        public bool AlreadyHaveGood(string goodName)
        {
            using (_context = new WarehouseContext())
            {
                if (_context.Goods.Any(x => x.GoodName.ToLower() == goodName.ToLower()))
                {
                    return true;
                }
                return false;
            }
        }
    }
}