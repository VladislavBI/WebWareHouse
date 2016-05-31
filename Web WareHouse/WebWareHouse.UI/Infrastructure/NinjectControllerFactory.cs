using System;
using System.Web.Mvc;
using System.Web.Routing;
using Ninject;
using Webwarehouse.UI.Models.Abstract;
using Webwarehouse.UI.Models.Concrete;

namespace Webwarehouse.UI.Infrastructure
{
    /// <summary>
    /// incrementing of ninject
    /// </summary>
    public class NinjectControllerFactory : DefaultControllerFactory
    {
        /// <summary>
        /// ninject implementor field
        /// </summary>
        private readonly IKernel _ninjectKernel;

        public NinjectControllerFactory()
        {
            _ninjectKernel = new StandardKernel();
            AddBindings();
        }

        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            // получение объекта контроллера из контейнера
            // используя его тип
            return controllerType == null ? null : (IController) _ninjectKernel.Get(controllerType);
        }

        private void AddBindings()
        {
            //for base operations at goods - working with entity framework
            _ninjectKernel.Bind<IGoodManager>().To<EfGoodManager>();
        }
    }
}