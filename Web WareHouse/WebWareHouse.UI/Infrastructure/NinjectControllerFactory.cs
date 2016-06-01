using System;
using System.Web.Mvc;
using System.Web.Routing;
using Ninject;
using Webwarehouse.UI.Models.Abstract;
using Webwarehouse.UI.Models.Concrete;

namespace Webwarehouse.UI.Infrastructure
{
    /// <summary>
    /// Incrementing of Dependecy injection using ninject.
    /// </summary>
    public class NinjectControllerFactory : DefaultControllerFactory
    {
        /// <summary>
        /// Ninject implementor field.
        /// </summary>
        private readonly IKernel _ninjectKernel;

        //Adding all Dependency injections bindings.
        public NinjectControllerFactory()
        {
            _ninjectKernel = new StandardKernel();
            AddBindings();
        }

        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            // Receiving controller instance
            //using it's type.
            return controllerType == null ? null : (IController) _ninjectKernel.Get(controllerType);
        }

        private void AddBindings()
        {
            //For base operations at goods - working with Entity Framework.
            _ninjectKernel.Bind<IGoodManager>().To<EfGoodManager>();
        }
    }
}