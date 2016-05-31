using System.Collections.Generic;
using Webwarehouse.UI.Models.Entities;

namespace Webwarehouse.UI.Models.Abstract
{
    /// <summary>
    /// Manager for goods operations
    /// </summary>
    public interface IGoodManager
    {

        /// <summary>
        /// Adding of new good to base.
        /// </summary>
        /// <param name="good">new good</param>
        void AddGood(Good good);

        /// <summary>
        /// Checking if we already have this good
        /// </summary>
        /// <param name="goodName">name of good for check</param>
        /// <returns>true - exist</returns>
        bool AlreadyHaveGood(string goodName);
    }
}